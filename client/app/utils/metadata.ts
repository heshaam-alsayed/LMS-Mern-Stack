type MetaData = { title: string; description: string; keywords: string[] };

export function Meta(props: MetaData): MetaData {
  return {
    title: props.title,
    description: props.description,
    keywords: props.keywords,
  };
}
