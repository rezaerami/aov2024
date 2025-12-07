function chunkify(str, size) {
  if (size <= 0) throw new Error('Chunk size must be greater than 0');
  const chunks = [];
  for (let i = 0; i < str.length; i += size) {
    chunks.push(str.slice(i, i + size));
  }
  return chunks;
}


module.exports = {
    chunkify,
};
