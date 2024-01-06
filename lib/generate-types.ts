import { convertFromDirectory } from 'joi-to-typescript';

async function types(): Promise<void> {
  console.info('Running joi-to-typescript...');

  try {
    await convertFromDirectory({
      schemaDirectory: './src/validators',
      typeOutputDirectory: './src/types/joi',
      flattenTree: true,
      debug: true,
      defaultToRequired: true,
      inputFileFilter: /.schemas/,
    });

    console.info('Completed joi-to-typescript');
  } catch (err) {
    console.error('Failed to run joi-to-typescript', err);
  }
}

types();
