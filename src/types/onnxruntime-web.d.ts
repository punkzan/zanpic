/**
 * Type declarations for onnxruntime-web
 *
 * The package ships types at types.d.ts but package.json "exports"
 * prevents TypeScript from resolving them under moduleResolution: "bundler".
 * This shim provides minimal type coverage for our usage.
 */

declare module 'onnxruntime-web' {
  export type TensorType =
    | 'float32'
    | 'float64'
    | 'int8'
    | 'uint8'
    | 'int16'
    | 'uint16'
    | 'int32'
    | 'uint32'
    | 'string'
    | 'bool'

  export interface Env {
    wasm: {
      wasmPaths: string
      proxy: boolean
      numThreads?: number
      simd?: boolean
    }
    webgpu?: {
      deviceDestroy?: boolean
    }
  }

  export interface Tensor {
    data: Float32Array | Int32Array | Uint8Array | BigInt64Array | string[]
    dims: readonly number[]
    type: TensorType
    size: number
  }

  export interface TensorConstructor {
    new (type: TensorType, data: ArrayLike<number> | ArrayBufferView, dims: number[]): Tensor
  }

  export interface SessionOptions {
    executionProviders?: string[]
    graphOptimizationLevel?: string
    enableMemPattern?: boolean
    enableCpuMemArena?: boolean
    extra?: Record<string, unknown>
  }

  export interface InferenceSession {
    run(feeds: Record<string, Tensor>): Promise<Record<string, Tensor>>
    release(): void
    readonly inputNames: string[]
    readonly outputNames: string[]
  }

  export interface InferenceSessionFactory {
    create(
      model: ArrayBuffer | Uint8Array,
      options?: SessionOptions,
    ): Promise<InferenceSession>
  }

  export const env: Env
  export const Tensor: TensorConstructor
  export const InferenceSession: InferenceSessionFactory
}
