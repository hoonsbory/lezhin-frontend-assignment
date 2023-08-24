// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  ComicRankApiFailResponse,
  ComicRankApiSuccessResponse,
} from '@pages/datas/webtoonDatas';
import dramaComicDatas from '@pages/datas/drama/dramaComicDatas';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ComicRankApiSuccessResponse | ComicRankApiFailResponse>,
) {
  const page = Number(req.query.page);
  if (isNaN(page)) res.status(500).send({ error: 'error' });
  else res.status(200).json(dramaComicDatas[page - 1]);
}
