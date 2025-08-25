import { writeFileSync } from 'node:fs';

/**
 * Fetches a file and outputs its size using native Node.js fetch.
 * @param url - The URL of the file to fetch.
 */
async function fetchFileSize(url: string): Promise<void> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Try to get size from Content-Length header
    const contentLength = response.headers.get('content-length');
    if (contentLength) {
      console.log(`File size from headers: ${formatBytes(parseInt(contentLength))}`);
    }

    // If no Content-Length, download the file to determine size
    const blob = await response.blob();
    console.log(`File size from download: ${formatBytes(blob.size)}`);

    // Optional: Save the file to disk
    const fileName = url.split('/').pop() ?? 'down-loaded.file'
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(fileName, buffer);
    console.log(`File saved as ${fileName}`);

    console.log(buffer.toString('utf-8'));
  } catch (error) {
    console.error('Error fetching file:', error instanceof Error ? error.message : error);
  }
}

/**
 * Formats bytes into a human-readable string (e.g., "1.23 MB").
 * @param bytes - The number of bytes.
 * @returns Formatted string.
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Example usage
const fileUrl = 'https://jslib.k6.io/aws/0.14.0/s3.js';
fetchFileSize(fileUrl);
