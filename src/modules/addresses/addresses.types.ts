export interface CreateAddressDTO {
    full_name: string;
    phone: string;
    city: string;
    area?: string;
    street: string;
    building?: string;
    apartment?: string;
    notes?: string;
}

export interface UpdateAddressDTO extends CreateAddressDTO {}

export interface IAddress extends CreateAddressDTO {
    id: string;
    user_id: string;
    created_at: string;
    updated_at: string | null;
}
