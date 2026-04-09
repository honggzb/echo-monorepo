### Knowledge base

1. add `listFile` function to 'packages\backend\convex\private\files.ts'
2. Create File View component
   1. create 'apps\web\modules\files\ui\views\files-view.tsx'
   2. add `FileView` to 'apps\web\app\(dashboard)\files\page.tsx'
3. create Convex RAG component
   1. table  - 'apps\web\modules\files\ui\views\files-view.tsx'
   2. Upload dialog - 'apps\web\modules\files\ui\components\upload-file-dialog.tsx'
      - need 'dropzone.tsx' in ui, `pnpm -F ui add react-dropzone`
      - refer to https://www.kibo-ui.com/components/dropzone
   3. delete dialog - 'apps\web\modules\files\ui\components\delete-file-dialog.tsx'
   4. https://www.convex.dev/components/rag

[🚀back to top](#top)
