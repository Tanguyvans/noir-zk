nargo check

nargo execute

bb prove -b ./target/circuit.json -w ./target/circuit.gz -o ./target/proof
bb write_vk -b ./target/circuit.json -o ./target/vk
bb verify -k ./target/vk -p ./target/proof
