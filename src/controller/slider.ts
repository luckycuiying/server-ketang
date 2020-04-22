import { Request, Response} from 'express';
// 客户端会把token放在请求头里发给服务器
import { SliderDocument, Slider } from '../models';
export const list = async (_req: Request, res: Response) => {
    let sliders: SliderDocument[] = await Slider.find();
    res.json({ success: true, data: sliders });
}