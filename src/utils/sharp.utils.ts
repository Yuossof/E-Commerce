import sharp from 'sharp';

export const resizingImg = async (buffer: Buffer): Promise<Buffer> => {
    const outputBuffer = await sharp(buffer)
        .webp({ quality: 80 })
        .toBuffer();

    return outputBuffer;
}