declare module 'remote_standard/standardRouter' {
  const RemoteRouter: React.ComponentType;
  export default RemoteRouter;
}

// 添加 import.meta 类型声明
interface ImportMetaEnv {
  readonly VITE_CUSTOM: string;
  // 可以根据需要添加更多环境变量
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  glob(pattern: string, options?: { eager?: boolean }): Record<string, any>;
} 