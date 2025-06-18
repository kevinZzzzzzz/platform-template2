// * Echarts 按需引入
// @ts-ignore
import * as echarts from "echarts/core";
// @ts-ignore
import {
	BarChart,
	// 系列类型的定义后缀都为 SeriesOption
	BarSeriesOption,
	LineChart,
	LineSeriesOption
  // @ts-ignore
} from "echarts/charts";
// @ts-ignore
import { LegendComponent } from "echarts/components";
import {
	TitleComponent,
	// 组件类型的定义后缀都为 ComponentOption
	TitleComponentOption,
	TooltipComponent,
	TooltipComponentOption,
	GridComponent,
	GridComponentOption,
	// 数据集组件
	DatasetComponent,
	DatasetComponentOption,
	// 内置数据转换器组件 (filter, sort)
	TransformComponent
  // @ts-ignore
} from "echarts/components";
// @ts-ignore
import { LabelLayout, UniversalTransition } from "echarts/features";
// @ts-ignore
import { CanvasRenderer } from "echarts/renderers";

// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
export type ECOption = echarts.ComposeOption<
	| BarSeriesOption
	| LineSeriesOption
	| TitleComponentOption
	| TooltipComponentOption
	| GridComponentOption
	| DatasetComponentOption
>;

// 注册必须的组件
echarts.use([
	LegendComponent,
	TitleComponent,
	TooltipComponent,
	GridComponent,
	DatasetComponent,
	TransformComponent,
	BarChart,
	LineChart,
	LabelLayout,
	UniversalTransition,
	CanvasRenderer
]);

export default echarts;
