export default { 
    base: '/noir-zk/',
    build: {
      target: 'esnext',
      rollupOptions: {
        input: {
          main: './index.html',
        },
      },
      assetsInclude: ['**/*.nr', '**/*.toml', '**/*.wasm'],
    },
    optimizeDeps: { 
      esbuildOptions: { 
        target: "esnext" 
      } 
    } 
  };