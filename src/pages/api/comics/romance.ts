// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  ComicRankApiFailResponse,
  ComicRankApiSuccessResponse,
} from '../../../interfaces/comicsInterface';
import romanceComicDatas from '@pages/datas/romance/romanceComicDatas';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ComicRankApiSuccessResponse | ComicRankApiFailResponse>,
) {
  const page = Number(req.query.page);
  setTimeout(() => {
    if (isNaN(page)) res.status(500).send({ error: '잘못된 페이지입니다.' });
    else res.status(200).json(romanceComicDatas[page - 1]);
  }, 1000);
}
