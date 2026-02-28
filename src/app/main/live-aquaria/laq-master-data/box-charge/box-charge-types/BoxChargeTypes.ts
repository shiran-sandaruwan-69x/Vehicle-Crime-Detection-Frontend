export type CupCompSubmitData = {
	diameter1?: number;
	cupHeight?: number;
	incrementalHeight1?: number;
	diameter2?: number;
	lidHeight?: number;
	incrementalHeight2?: number;
	forAreaOfCup?: number;
	volumeOfCup?: number;
	forAreaOfLid?: number;
	volumeOfLid?: number;
	cupName?: string;
	cupCharge?: number;
};

export type CupCompSubmitFormData = {
	diameter1?: string;
	cupHeight?: string;
	incrementalHeight1?: string;
	diameter2?: string;
	lidHeight?: string;
	incrementalHeight2?: string;
	forAreaOfCup?: string;
	volumeOfCup?: string;
	forAreaOfLid?: string;
	volumeOfLid?: string;
	cupName?: string;
	cupCharge?: string;
};

export type PolyBagSubmitData = {
	length: number;
	width: number;
	height: number;
	bottomArea: number;
	boxVolume: number;
	polyBagName: string;
	polyBagCharge: number;
};

export type BoxSubmitData = {
	length: string;
	width: string;
	height: string;
	bottomArea: string;
	boxVolume: string;
	boxChargeName: string;
	boxCharge: string;
};

export type BoxSubmitCalData = {
	length: number;
	width: number;
	height: number;
	bottomArea: number;
	boxVolume: number;
	boxChargeName: string;
	boxCharge: number;
};

export type PackingMeterialSubmitData = {
	packingMaterialsName: string;
	unitOfMeasure: string;
	noOfUnits: string;
	price: string;
};

export type UnitOfMeasure = {
	id?: string;
	name?: string;
	is_active?: number;
};

export type Meta = {
	total: number;
};

export type UnitOfMeasureType = {
	data?: UnitOfMeasure[];
};

export type PackingMaterialData = {
	id?: string;
	packing_type_id?: number;
	packing_type_name?: string;
	name?: string;
	length?: string;
	width?: string;
	height?: string;
	bottom_area?: string;
	volume?: string;
	charge?: string;
	diameter?: string;
	incremental_height?: string;
	lid_diameter?: string;
	lid_height?: string;
	lid_incremental_height?: string;
	floor_area_of_lid?: string;
	volume_of_lid?: string;
	unit_of_measure_id?: string;
	unit_of_measure_name?: string;
	unit_price?: string;
	no_of_units?: string;
	is_active?: number;
};

export type PackingMaterialType = {
	data?: PackingMaterialData[];
	meta?: Meta;
};

export type ModifiedPackingMaterialData = {
	id?: string;
	packing_type_id?: number;
	packing_type_name?: string;
	name?: string;
	length?: string;
	width?: string;
	height?: string;
	bottom_area?: string;
	volume?: string;
	charge?: string;
	diameter?: string;
	incremental_height?: string;
	lid_diameter?: string;
	lid_height?: string;
	lid_incremental_height?: string;
	floor_area_of_lid?: string;
	volume_of_lid?: string;
	unit_of_measure_id?: string;
	unit_of_measure_name?: string;
	unit_price?: string;
	no_of_units?: string;
	is_active?: number;
	boxChargeName?: string;
	type?: string;
	price?: string;
	active?: boolean;
};

export type PackingMeterialCompType = {
	packingMaterialsName?: string;
	unitOfMeasure?: string;
	noOfUnits?: string;
	price?: string;
};

export type PolyBagData = {
	length?: string;
	width?: string;
	height?: string;
	bottomArea?: string;
	boxVolume?: string;
	polyBagName?: string;
	polyBagCharge?: string;
};
