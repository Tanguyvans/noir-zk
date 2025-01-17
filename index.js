import { compile, createFileManager } from "@noir-lang/noir_wasm";
import { UltraPlonkBackend } from "@aztec/bb.js";
import { Noir } from "@noir-lang/noir_js";
import initNoirC from "@noir-lang/noirc_abi";
import initACVM from "@noir-lang/acvm_js";
// import acvm from "@noir-lang/acvm_js/web/acvm_js_bg.wasm?url";
// import noirc from "@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm?url";

// Utiliser les URLs directes pour les fichiers WASM
const acvm = "https://unpkg.com/@noir-lang/acvm_js@1.0.0-beta.0/web/acvm_js_bg.wasm";
const noirc = "https://unpkg.com/@noir-lang/noirc_abi@1.0.0-beta.0/web/noirc_abi_wasm_bg.wasm";


await Promise.all([initACVM(fetch(acvm)), initNoirC(fetch(noirc))]);

// import main from "./circuit/src/main.nr?url";
// import nargoToml from "./circuit/Nargo.toml?url";

import main from "./circuit/src/main.nr?raw";
import nargoToml from "./circuit/Nargo.toml?raw";

export async function getCircuit() {
	const fm = createFileManager("/");
	const { body } = await fetch(main);
	const { body: nargoTomlBody } = await fetch(nargoToml);

	fm.writeFile("./src/main.nr", body);
	fm.writeFile("./Nargo.toml", nargoTomlBody);
	return await compile(fm);
}
const show = (id, content) => {
	const container = document.getElementById(id);
	container.appendChild(document.createTextNode(content));
	container.appendChild(document.createElement("br"));
};

document.getElementById("submit").addEventListener("click", async () => {
	try {
		// noir goes here
		const { program } = await getCircuit();
		const noir = new Noir(program);
		const backend = new UltraPlonkBackend(program.bytecode);
		const age = document.getElementById("age").value;

		const input = Array.from({ length: 784 }, () => Math.floor(Math.random() * 256));

		show("logs", "Generating witness... ⏳");
		const { witness } = await noir.execute({ input });
		show("logs", "Generated witness... ✅");
		show("logs", "Generating proof... ⏳");
		const proof = await backend.generateProof(witness);
		show("logs", "Generated proof... ✅");
		show("results", proof.proof);
		show("logs", "Verifying proof... ⌛");
		const isValid = await backend.verifyProof(proof);
		show("logs", `Proof is ${isValid ? "valid" : "invalid"}... ✅`);
	} catch (err) {
		console.error(err);
		show("logs", "Oh 💔");
	}
});