// vite.config.js
import { defineConfig } from "file:///C:/Users/Administrator/WorkBuddy/2026-07-04-22-05-57/pixel-studio/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Administrator/WorkBuddy/2026-07-04-22-05-57/pixel-studio/node_modules/@vitejs/plugin-react/dist/index.js";
var vite_config_default = defineConfig(function(_a) {
  var mode = _a.mode;
  return {
    plugins: [react()],
    // Dev server
    server: {
      port: 5173,
      open: true
    },
    // Production build
    build: {
      target: "es2020",
      chunkSizeWarningLimit: 1e3,
      // ── Security: never expose source maps in production ──
      sourcemap: false,
      // ── Use terser for aggressive minification + mangling ──
      minify: "terser",
      terserOptions: {
        compress: {
          // Remove all console.* calls in production
          drop_console: true,
          // Remove debugger statements
          drop_debugger: true,
          // Remove unused functions
          pure_funcs: ["console.log", "console.info", "console.debug", "console.warn"]
        },
        mangle: {
          // Obfuscate variable and function names
          toplevel: true,
          // Keep only essential names for library interop
          reserved: ["ZanPic", "Fabric"]
        },
        format: {
          // Remove all comments
          comments: false
        }
      },
      rollupOptions: {
        output: {
          manualChunks: {
            fabric: ["fabric"],
            react: ["react", "react-dom"],
            ai: ["@imgly/background-removal"],
            utils: ["zustand"]
          }
        }
      }
    },
    // Exclude native/Node.js deps from Vite optimization
    optimizeDeps: {
      exclude: ["canvas", "jsdom", "@imgly/background-removal"]
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxBZG1pbmlzdHJhdG9yXFxcXFdvcmtCdWRkeVxcXFwyMDI2LTA3LTA0LTIyLTA1LTU3XFxcXHBpeGVsLXN0dWRpb1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcQWRtaW5pc3RyYXRvclxcXFxXb3JrQnVkZHlcXFxcMjAyNi0wNy0wNC0yMi0wNS01N1xcXFxwaXhlbC1zdHVkaW9cXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0FkbWluaXN0cmF0b3IvV29ya0J1ZGR5LzIwMjYtMDctMDQtMjItMDUtNTcvcGl4ZWwtc3R1ZGlvL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKGZ1bmN0aW9uIChfYSkge1xuICAgIHZhciBtb2RlID0gX2EubW9kZTtcbiAgICByZXR1cm4gKHtcbiAgICAgICAgcGx1Z2luczogW3JlYWN0KCldLFxuICAgICAgICAvLyBEZXYgc2VydmVyXG4gICAgICAgIHNlcnZlcjoge1xuICAgICAgICAgICAgcG9ydDogNTE3MyxcbiAgICAgICAgICAgIG9wZW46IHRydWUsXG4gICAgICAgIH0sXG4gICAgICAgIC8vIFByb2R1Y3Rpb24gYnVpbGRcbiAgICAgICAgYnVpbGQ6IHtcbiAgICAgICAgICAgIHRhcmdldDogJ2VzMjAyMCcsXG4gICAgICAgICAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDEwMDAsXG4gICAgICAgICAgICAvLyBcdTI1MDBcdTI1MDAgU2VjdXJpdHk6IG5ldmVyIGV4cG9zZSBzb3VyY2UgbWFwcyBpbiBwcm9kdWN0aW9uIFx1MjUwMFx1MjUwMFxuICAgICAgICAgICAgc291cmNlbWFwOiBmYWxzZSxcbiAgICAgICAgICAgIC8vIFx1MjUwMFx1MjUwMCBVc2UgdGVyc2VyIGZvciBhZ2dyZXNzaXZlIG1pbmlmaWNhdGlvbiArIG1hbmdsaW5nIFx1MjUwMFx1MjUwMFxuICAgICAgICAgICAgbWluaWZ5OiAndGVyc2VyJyxcbiAgICAgICAgICAgIHRlcnNlck9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBjb21wcmVzczoge1xuICAgICAgICAgICAgICAgICAgICAvLyBSZW1vdmUgYWxsIGNvbnNvbGUuKiBjYWxscyBpbiBwcm9kdWN0aW9uXG4gICAgICAgICAgICAgICAgICAgIGRyb3BfY29uc29sZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgLy8gUmVtb3ZlIGRlYnVnZ2VyIHN0YXRlbWVudHNcbiAgICAgICAgICAgICAgICAgICAgZHJvcF9kZWJ1Z2dlcjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgLy8gUmVtb3ZlIHVudXNlZCBmdW5jdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgcHVyZV9mdW5jczogWydjb25zb2xlLmxvZycsICdjb25zb2xlLmluZm8nLCAnY29uc29sZS5kZWJ1ZycsICdjb25zb2xlLndhcm4nXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG1hbmdsZToge1xuICAgICAgICAgICAgICAgICAgICAvLyBPYmZ1c2NhdGUgdmFyaWFibGUgYW5kIGZ1bmN0aW9uIG5hbWVzXG4gICAgICAgICAgICAgICAgICAgIHRvcGxldmVsOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAvLyBLZWVwIG9ubHkgZXNzZW50aWFsIG5hbWVzIGZvciBsaWJyYXJ5IGludGVyb3BcbiAgICAgICAgICAgICAgICAgICAgcmVzZXJ2ZWQ6IFsnWmFuUGljJywgJ0ZhYnJpYyddLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZm9ybWF0OiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFJlbW92ZSBhbGwgY29tbWVudHNcbiAgICAgICAgICAgICAgICAgICAgY29tbWVudHM6IGZhbHNlLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICAgICAgICAgIG91dHB1dDoge1xuICAgICAgICAgICAgICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhYnJpYzogWydmYWJyaWMnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYWN0OiBbJ3JlYWN0JywgJ3JlYWN0LWRvbSddLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWk6IFsnQGltZ2x5L2JhY2tncm91bmQtcmVtb3ZhbCddLFxuICAgICAgICAgICAgICAgICAgICAgICAgdXRpbHM6IFsnenVzdGFuZCddLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICAvLyBFeGNsdWRlIG5hdGl2ZS9Ob2RlLmpzIGRlcHMgZnJvbSBWaXRlIG9wdGltaXphdGlvblxuICAgICAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgICAgICAgIGV4Y2x1ZGU6IFsnY2FudmFzJywgJ2pzZG9tJywgJ0BpbWdseS9iYWNrZ3JvdW5kLXJlbW92YWwnXSxcbiAgICAgICAgfSxcbiAgICB9KTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFpWSxTQUFTLG9CQUFvQjtBQUM5WixPQUFPLFdBQVc7QUFDbEIsSUFBTyxzQkFBUSxhQUFhLFNBQVUsSUFBSTtBQUN0QyxNQUFJLE9BQU8sR0FBRztBQUNkLFNBQVE7QUFBQSxJQUNKLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQTtBQUFBLElBRWpCLFFBQVE7QUFBQSxNQUNKLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxJQUNWO0FBQUE7QUFBQSxJQUVBLE9BQU87QUFBQSxNQUNILFFBQVE7QUFBQSxNQUNSLHVCQUF1QjtBQUFBO0FBQUEsTUFFdkIsV0FBVztBQUFBO0FBQUEsTUFFWCxRQUFRO0FBQUEsTUFDUixlQUFlO0FBQUEsUUFDWCxVQUFVO0FBQUE7QUFBQSxVQUVOLGNBQWM7QUFBQTtBQUFBLFVBRWQsZUFBZTtBQUFBO0FBQUEsVUFFZixZQUFZLENBQUMsZUFBZSxnQkFBZ0IsaUJBQWlCLGNBQWM7QUFBQSxRQUMvRTtBQUFBLFFBQ0EsUUFBUTtBQUFBO0FBQUEsVUFFSixVQUFVO0FBQUE7QUFBQSxVQUVWLFVBQVUsQ0FBQyxVQUFVLFFBQVE7QUFBQSxRQUNqQztBQUFBLFFBQ0EsUUFBUTtBQUFBO0FBQUEsVUFFSixVQUFVO0FBQUEsUUFDZDtBQUFBLE1BQ0o7QUFBQSxNQUNBLGVBQWU7QUFBQSxRQUNYLFFBQVE7QUFBQSxVQUNKLGNBQWM7QUFBQSxZQUNWLFFBQVEsQ0FBQyxRQUFRO0FBQUEsWUFDakIsT0FBTyxDQUFDLFNBQVMsV0FBVztBQUFBLFlBQzVCLElBQUksQ0FBQywyQkFBMkI7QUFBQSxZQUNoQyxPQUFPLENBQUMsU0FBUztBQUFBLFVBQ3JCO0FBQUEsUUFDSjtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUE7QUFBQSxJQUVBLGNBQWM7QUFBQSxNQUNWLFNBQVMsQ0FBQyxVQUFVLFNBQVMsMkJBQTJCO0FBQUEsSUFDNUQ7QUFBQSxFQUNKO0FBQ0osQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
