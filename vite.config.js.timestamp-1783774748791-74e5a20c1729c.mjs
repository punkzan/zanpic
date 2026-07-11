// vite.config.js
import { defineConfig } from "file:///C:/Users/Administrator/WorkBuddy/2026-07-04-22-05-57/pixel-studio/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Administrator/WorkBuddy/2026-07-04-22-05-57/pixel-studio/node_modules/@vitejs/plugin-react/dist/index.js";
var vite_config_default = defineConfig({
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
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxBZG1pbmlzdHJhdG9yXFxcXFdvcmtCdWRkeVxcXFwyMDI2LTA3LTA0LTIyLTA1LTU3XFxcXHBpeGVsLXN0dWRpb1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcQWRtaW5pc3RyYXRvclxcXFxXb3JrQnVkZHlcXFxcMjAyNi0wNy0wNC0yMi0wNS01N1xcXFxwaXhlbC1zdHVkaW9cXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0FkbWluaXN0cmF0b3IvV29ya0J1ZGR5LzIwMjYtMDctMDQtMjItMDUtNTcvcGl4ZWwtc3R1ZGlvL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgICBwbHVnaW5zOiBbcmVhY3QoKV0sXG4gICAgLy8gRGV2IHNlcnZlclxuICAgIHNlcnZlcjoge1xuICAgICAgICBwb3J0OiA1MTczLFxuICAgICAgICBvcGVuOiB0cnVlLFxuICAgIH0sXG4gICAgLy8gUHJvZHVjdGlvbiBidWlsZFxuICAgIGJ1aWxkOiB7XG4gICAgICAgIHRhcmdldDogJ2VzMjAyMCcsXG4gICAgICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMTAwMCxcbiAgICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgICAgICAgICAgIGZhYnJpYzogWydmYWJyaWMnXSxcbiAgICAgICAgICAgICAgICAgICAgcmVhY3Q6IFsncmVhY3QnLCAncmVhY3QtZG9tJ10sXG4gICAgICAgICAgICAgICAgICAgIGFpOiBbJ0BpbWdseS9iYWNrZ3JvdW5kLXJlbW92YWwnXSxcbiAgICAgICAgICAgICAgICAgICAgdXRpbHM6IFsnenVzdGFuZCddLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgIH0sXG4gICAgLy8gRXhjbHVkZSBuYXRpdmUvTm9kZS5qcyBkZXBzIGZyb20gVml0ZSBvcHRpbWl6YXRpb25cbiAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgICAgZXhjbHVkZTogWydjYW52YXMnLCAnanNkb20nLCAnQGltZ2x5L2JhY2tncm91bmQtcmVtb3ZhbCddLFxuICAgIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBaVksU0FBUyxvQkFBb0I7QUFDOVosT0FBTyxXQUFXO0FBQ2xCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQ3hCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQTtBQUFBLEVBRWpCLFFBQVE7QUFBQSxJQUNKLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNWO0FBQUE7QUFBQSxFQUVBLE9BQU87QUFBQSxJQUNILFFBQVE7QUFBQSxJQUNSLHVCQUF1QjtBQUFBLElBQ3ZCLGVBQWU7QUFBQSxNQUNYLFFBQVE7QUFBQSxRQUNKLGNBQWM7QUFBQSxVQUNWLFFBQVEsQ0FBQyxRQUFRO0FBQUEsVUFDakIsT0FBTyxDQUFDLFNBQVMsV0FBVztBQUFBLFVBQzVCLElBQUksQ0FBQywyQkFBMkI7QUFBQSxVQUNoQyxPQUFPLENBQUMsU0FBUztBQUFBLFFBQ3JCO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQUE7QUFBQSxFQUVBLGNBQWM7QUFBQSxJQUNWLFNBQVMsQ0FBQyxVQUFVLFNBQVMsMkJBQTJCO0FBQUEsRUFDNUQ7QUFDSixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
