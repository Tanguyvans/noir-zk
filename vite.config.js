export default { 
    base: '/noir-zk/',
    build: {
      target: 'esnext'
    },
    optimizeDeps: { 
      esbuildOptions: { 
        target: "esnext" 
      } 
    } 
  };