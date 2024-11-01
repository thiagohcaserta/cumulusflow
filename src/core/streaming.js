export class StreamingController {
  constructor() {
    this.encoder = new TextEncoder();
  }

  createStream() {
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const reader = stream.readable.getReader();
    return { stream, writer, reader };
  }

  async write(writer, chunk) {
    await writer.write(this.encoder.encode(chunk));
  }

  async *streamGenerator(reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      yield value;
    }
  }
}