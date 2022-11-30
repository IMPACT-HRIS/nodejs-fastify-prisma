function zodValidatorCompiler({ schema }: { schema: any }) {
  return (data: unknown) => {
    try {
      return { value: schema.parse(data) }
    } catch (e) {
      return { error: e as Error }
    }
  }
}

export default zodValidatorCompiler
