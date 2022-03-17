export default function loader(source) {
  const options = this.getOptions();

  // eslint-disable-next-line no-param-reassign
  source = source.replace(/\[name\]/g, options.name);

  return `export default ${JSON.stringify(source)}`;
}
