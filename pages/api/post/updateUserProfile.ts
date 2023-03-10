import type { NextApiRequest, NextApiResponse } from 'next';
import { usersCollection } from '../../../utils/dbConnect';
import { ObjectId } from 'mongodb';

type Data =
  | { toUpdate: { nome: string; endereco: string; sexo: string } }
  | { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    try {
      const {
        _id,
        editNome: nome,
        editEndereco: endereco,
        editSexo: sexo,
      } = JSON.parse(req.body);
      const toUpdate = { nome, endereco, sexo };
      const update = await usersCollection!.updateOne(
        { _id: new ObjectId(_id) },
        { $set: toUpdate }
      );

      res.status(200).json({ toUpdate });
    } catch (err: any) {
      res.status(err.status).json({ message: err.message });
    }
  }
}
