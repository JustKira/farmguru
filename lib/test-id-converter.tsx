function testIdConverter(input: string): string {
  // Step 1: Convert the entire string to lowercase
  let result = input.toLowerCase();

  // Step 2: Replace spaces and any non-alphanumeric characters (except dashes) with dashes
  result = result.replace(/[^a-z0-9-]+/g, '-');

  return result;
}

export default testIdConverter;
