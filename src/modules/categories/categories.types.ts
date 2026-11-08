export interface CreateCategoryDTO {
    name: string;
    slug: string;
    description: string;
}

export interface UpdateCategoryDTO {
    name: string;
    slug: string;
    description: string;
}

export interface CreateSubCategoryDTO {
    parent_id: string;
    name: string;
    slug: string;
    description: string;
}


export interface UpdateSubCategoryDTO {
    parent_id: string;
    name: string;
    slug: string;
    description: string;
}