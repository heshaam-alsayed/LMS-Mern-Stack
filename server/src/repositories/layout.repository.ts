import {
  ICreateLayoutData,
  ILayoutDocument,
  LayoutType,
} from "../interfaces/layoutInterface";
import LayoutModel from "../models/layout.model";

const createLayout = async (layoutData: ICreateLayoutData) => {
  return await LayoutModel.create(layoutData);
};

const getLayoutByType = async (type: LayoutType) => {
  return await LayoutModel.findOne({ type });
};
const updateLayout = async (
  type: LayoutType,
  layoutData: Partial<ILayoutDocument>,
) => {
  return await LayoutModel.findOneAndUpdate(
    { type },
    { $set: layoutData },
    {
      new: true,
      runValidators: true,
    },
  );
};

const getAllLayouts = async () => {
  return await LayoutModel.find().sort({ createdAt: -1 }).lean();
};
const layoutRepository = {
  createLayout,
  getLayoutByType,
  updateLayout,
  getAllLayouts,
};

export default layoutRepository;
