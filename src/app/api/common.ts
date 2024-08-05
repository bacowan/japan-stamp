import { Result } from "@/utils/Result";
import { fileTypeFromBlob } from "file-type";
import sharp from "sharp";
import { getStorage } from "firebase-admin/storage";

const validFileTypes = ['image/jpeg', 'image/png', 'image/gif'];

export async function prepareImageForUpload(image: File): Promise<Result<Buffer>> {
    const fileType = await fileTypeFromBlob(image);
    if (fileType && validFileTypes.includes(fileType.mime)) {
        try {
            const jpegBuffer = await sharp(await image.arrayBuffer())
                .resize(200)
                .jpeg({ quality: 80 })
                .toBuffer();
            return {
                type: "success",
                value: jpegBuffer
            }
        }
        catch (e) {
            return {
                type: "failure",
                message: "failed to format image"
            }
        }
    }
    else {
        return {
            type: "failure",
            message: "invalid file type"
        }
    }
}