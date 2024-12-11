# Folder Comparison Script

This script compares the contents of two directories and identifies files that are unique to each directory. The results are printed to the console and also saved to a `README.md` file in the current working directory.

## How It Works

1. **Recursively Lists Files**:
   The script traverses both directories recursively to gather all files.

2. **Compares File Paths**:
   It compares the relative paths of files in each directory.

3. **Outputs Results**:
   - Files unique to the first directory.
   - Files unique to the second directory.
   - Results are written to a `README.md` file.

## Requirements

- **Node.js** installed on your system.
- The `fs-extra` package. Install it using:
  ```bash
  npm install fs-extra
  ```

## Usage

1. Save the script as `index.js`.
2. Run the script from the terminal with the following syntax:
   ```bash
   node index.js <folder1> <folder2>
   ```
   Replace `<folder1>` and `<folder2>` with the paths to the two directories you want to compare.

### Example

```bash
node index.js /path/to/folder1 /path/to/folder2
```

### Output

- The console will display:
  - Files only in Folder 1.
  - Files only in Folder 2.

## License

This script is provided as-is and can be modified for personal or commercial use.

