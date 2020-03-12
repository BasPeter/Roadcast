import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

class UploadAdapter {
  loader;
  constructor( loader ) {
    // The file loader instance to use during the upload.
    this.loader = loader;
  }

  // Starts the upload process.
  upload() {
    // Update the loader's progress.
    // server.onUploadProgress( data => {
    //   loader.uploadTotal = data.total;
    //   loader.uploaded = data.uploaded;
    // } );
    //
    // // Return a promise that will be resolved when the file is uploaded.
    // return loader.file
    //   .then( file => server.upload( file ) );
  }

  // Aborts the upload process.
  abort() {
    // Reject the promise returned from the upload() method.
    // server.abortUpload();
  }
}

export function FirebaseUploadAdapter( editor ) {
  editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
    // Configure the URL to the upload script in your back-end here!
    return new UploadAdapter( loader );
  };
}
