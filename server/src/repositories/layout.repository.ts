import { ILayoutDocument } from "../interfaces/layoutInterface";
import LayoutModel from "../models/layout.model";

const createLayout = async (layoutData: Partial<ILayoutDocument>) => {
  return await LayoutModel.create(layoutData);
};

const getLayoutByType = async (type: string) => {
  return await LayoutModel.findOne({ type });
}
const updateLayout = async (
  type: string,
  layoutData: Partial<ILayoutDocument>,
) => {
  return await LayoutModel.findOneAndUpdate(
    { type },
    layoutData,
    {
      new: true,
      runValidators: true,
    },
  );
};
const layoutRepository = {
  createLayout, 
  getLayoutByType,
  updateLayout
};

export default layoutRepository;
