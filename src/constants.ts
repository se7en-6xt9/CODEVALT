export const ALLOWED_EXTENSIONS = [
  'txt', 'html', 'css', 'js', 'ts', 'cpp', 'c', 'py', 'java', 'cs', 'go', 'rb', 'php', 'json', 'xml', 'md', 'sql', 'sh', 'bash'
];

export const isAllowedFile = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  return ext && ALLOWED_EXTENSIONS.includes(ext);
};
