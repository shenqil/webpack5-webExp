// eslint-disable-next-line import/extensions
import compiler from './compiler.js';

// eslint-disable-next-line no-undef
test('Inserts name and outputs JavaScript', async () => {
  const stats = await compiler('example.txt', { name: 'Alice' });
  const output = stats.toJson({ source: true }).modules[0].source;

  console.log(output, stats.toJson());
  // eslint-disable-next-line no-undef
  expect(output).toBe('export default "Hey Alice!\\n"');
});
