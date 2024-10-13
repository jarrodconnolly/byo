async function countFrequency(stream) {
  const frequencies = new Map();
  for await (const chunk of stream) {
    let i = 0;
    while (i < chunk.length) {
      const c = chunk[i];
      const f = frequencies.get(c);
      if(f) {
        frequencies.set(c, f + 1);
      } else {
        frequencies.set(c, 1);
      }
      i++;
    }
  }
  return frequencies;
}

export { countFrequency };