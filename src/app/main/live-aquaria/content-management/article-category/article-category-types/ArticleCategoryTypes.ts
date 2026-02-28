export type ArticleCategorySubmit = {
	category?: string;
	aquaticType?: string;
	referenceName?: string;
};

export type ArticleSubItemCategory = {
	id?: string;
	name?: string;
	reference?: string;
	attachment?: string;
	is_active?: number;
	sub_item_categories: any;
};

export type ArticleCategoryResponse = {
	id?: string;
	name?: string;
	reference?: string;
	aquatic_type?: string;
	attachment?: string;
	is_active?: number;
	sub_item_categories?: ArticleSubItemCategory[];
};

export type Meta = {
	total?: number;
};

export type ArticleCategoryType = {
	data?: ArticleCategoryResponse[];
	meta?: Meta;
};

export type MappedArticleCategory = {
	id?: string;
	name?: string;
	reference?: string;
	aquatic_type?: string;
	attachment?: string;
	is_active?: number;
	sub_item_categories?: ArticleSubItemCategory[];
	categoryName?: string;
	referenceName?: string;
	active?: boolean;
};

export type ArticleCategoryDropDown = {
	label?: string;
	value?: string;
};

export type ArticleDetailsSubmit = {
	category?: string;
	author?: string;
	publishDate?: string;
	expireDate?: string;
};

export type ArticleContentSubmit = {
	title?: string;
	abstract?: string;
	tag_keywords?: string[];
};

export type RelatedArticleResponseType = {
	related_article_id?: string;
	article_id?: string;
	code?: string;
	article_category_id?: string;
	author?: string;
	start_date?: string;
	end_date?: string;
	title?: string;
	is_active?: number;
	attachment?: string;
	created_at?: string;
};

export type ArticleResponseType = {
	id?: string;
	author?: string;
	code?: string;
	start_date?: string;
	end_date?: string;
	title?: string;
	abstract?: string;
	keywords?: string;
	content?: string;
	reference?: string;
	is_active?: number;
	attachment?: string;
	article_category?: {
		id?: string;
		name?: string;
		reference?: string;
		attachment?: string;
		isActive?: number;
	};
	related_articles?: RelatedArticleResponseType[];
	createdAt?: string;
};

export type ArticleType = {
	data?: ArticleResponseType[];
	meta?: Meta;
};

export type ArticleOptionsSetDataType = {
	id?: string;
	cisCode?: string;
	title?: string;
	author?: string;
};

export type ArticleOptionsSubmitDataType = {
	reference?: string;
	cisCode?: string;
	tableData?: ArticleOptionsSetDataType[];
};

export type MappedArticle = {
	id?: string;
	author?: string;
	code?: string;
	start_date?: string;
	end_date?: string;
	title?: string;
	abstract?: string;
	keywords?: string;
	content?: string;
	reference?: string;
	is_active?: number;
	attachment?: string;
	article_category?: {
		id?: string;
		name?: string;
		reference?: string;
		attachment?: string;
		isActive?: number;
	};
	related_articles?: RelatedArticleResponseType[];
	createdAt?: string;
	no?: number;
	articleCode?: string;
	category?: string;
	articleTitle?: string;
	publishDate?: string;
	active?: boolean;
};
export type OnesObjectArticleType = {
	data?: ArticleResponseType;
};

export type ArticleSubmitType = {
	articleId?: string;
	category?: string;
	articleTitle?: string;
	publishDate?: string;
	author?: string;
	keywords?: string;
};