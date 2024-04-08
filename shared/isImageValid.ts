import https from 'https';

/**
 * 判断给定的链接是否是有效的图片。
 *
 * @param url 图片链接
 * @returns 返回一个Promise，解析为true表示是有效图片，否则为false。
 */
export async function isImageValid(url: string): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    https.get(url, (res) => {
      const contentType = res.headers['content-type'];

      // 检查Content-Type是否表示图片
      if (contentType && contentType.startsWith('image/')) {
        resolve(true);
      } else {
        resolve(false);
      }
    }).on('error', (error) => {
      reject(error);
    });
  });
}
