
/// <reference types="aws-sdk" />

//import * as AWS from 'aws-sdk';
import S3 from 'aws-sdk/clients/s3';
import axios from "../AxiosService";
import { store } from '@/store/store';
//import { setTempBucket } from '@/store/slices/appSlice';
//import { ManagedUpload } from 'aws-sdk/clients/s3';

let s3: S3;

    /**
     * get temp aws access/ todo: can also get authorised link  
     * @returns 
     */
    async function getConfig(): Promise<any> {
        const url = `/aws/config`;
        const response = await axios.get(url);
        return response.data;
    }

    /**
     * @param config 
     */
    export async function setAWSConfig() {
        //const dispatch = useAppDispatch();

        if (s3) {
            return new Promise((resolve, reject) => {
                resolve(s3);
            });
        }

        return await getConfig().then(config => {
             
            /*dispatch(setTempBucket({
                temp_bucket: config.bucket
            }));*/

            // Create credentials object
            s3 = new S3({
                accessKeyId: config.key,
                secretAccessKey: config.secret
            });

            // Set AWS config with credentials object
            /*S3.update({
                region: config.region,
                credentials: credentials
            });*/

            return s3;
        });
    }

    /**
     * Upload file to Amazon S3, return an observable to monitor progress
     * @param { File } file
     * @returns { Observable<any> }
     */
    export function uploadFileToTempS3(file: File, metadata = {}): Promise<any> {
        
        /*const maxUploadSize = 18874368; // 18 MB
        const maxImageUploadSize = 5000000; // 5 MB //https://sentry.io/organizations/pogi/issues/1885937107/?project=168200&query=is%3Aunresolved&statsPeriod=14d
    
        const txtMaxUploadSize = '18MB';*/

        const state = store.getState(); // Get the state directly from the store

        let { temp_bucket } = state.app;  
        // Check if temp_bucket is defined and not empty
    if (!temp_bucket) {
        //console.error("Error: temp_bucket is not defined or is empty.");
        //throw new Error("Bucket name is required for S3 upload.");

        temp_bucket = "studenthub-public-anyone-can-upload-24hr-expiry";
    }

        /*let s3 = new S3({
            apiVersion: '2006-03-01'
        });*/

        let extension = getFileExtension(file.name);

        let prefix = _getFileNameWithoutExtension(file.name);

        if(!prefix) {
            prefix = 'file';
        }

        let key = prefix + "-" + Date.now() + "." + extension;

        console.log(file, key, temp_bucket);

        let params = {
            Body: file, // the actual file file
            ACL: "public-read", // to allow public access to the file
            Bucket: temp_bucket, //bucket name
            Key: key, //file name
            ContentType: file.type, //(String) A standard MIME type describing the format of the object file
            Metadata: metadata
        }

        //return Observable.create((observer: Observer<any>) => {

            /*
            if(file.size > maxUploadSize) {
                return observer.error(this.translateService.transform('txt_max_upload_limit_exceed', { 'maxUploadSize': txtMaxUploadSize }));
            }

            if (file.type == 'image' && file.size > maxImageUploadSize) {
                return observer.error(this.translateService.transform('Maximum 5mb Upload is allowed'));
            }*/

            const currUpload = s3.upload(params);
        
            return currUpload.promise();

            /*observer.next(currUpload);

            currUpload.on('httpUploadProgress', (progress: ManagedUpload.Progress) => {
                observer.next(progress);
            });

            currUpload.send((err, data) => {
                if(err) {
                    observer.error(err);
                } else {
                    observer.next(data);
                }
            });*/
        //});
    }

    /**
     * Take file name / path and return the file name without extension.
     */
    function _getFileNameWithoutExtension(path: string) {

        let basename = path.split(/[\\/]/).pop();  // extract file name from full path ... (supports `\\` and `/` separators)

        if (!basename)
            return;

        const pos = basename.lastIndexOf(".");       // get last position of `.`

        if (basename === "" || pos < 1)            // if file name is empty or ...
            return "";                             //  `.` not found (-1) or comes first (0)

        return normalizeFileName(basename.slice(0, pos));            // extract file name ignoring `.` without extension
    }

    /**
     * replace space in name with `-`
     * @param fileName
     */
    function normalizeFileName(fileName: string) {
        return fileName.replace(/ /g, "-").replace(/%20/g, "-").replace(/([^a-z0-9 ]+)/gi, '-');
    }

    /**
     * Take file name / path and return the file extension.
     */
    function getFileExtension(path: string) {
        var basename = path.split(/[\\/]/).pop();  // extract file name from full path ...
                    
        if (!basename) {
            return;
        }
        // (supports `\\` and `/` separators)
        const pos = basename.lastIndexOf(".");       // get last position of `.`

        if (basename === "" || pos < 1)            // if file name is empty or ...
            return "";                             //  `.` not found (-1) or comes first (0)

        return basename.slice(pos + 1);            // extract extension ignoring `.`
    } 