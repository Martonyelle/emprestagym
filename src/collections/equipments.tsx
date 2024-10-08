import { buildCollection, buildProperty } from "firecms";
import { tipoAparelho } from "../@shared/enums/component.tsx";

export type Equipment = {
    id: string;
    name: string;
    price: number;
    status: string;
    main_image: string;
    description: string;
    categories: string[];
    available_quantity: number;
}


export const equipmentsCollection = buildCollection<Equipment>({
    name: "Equipamentos",
    singularName: "Equipamento",
    path: "equipments",
    icon: "LocalGroceryStore",
    group: "Location",
    permissions: ({}) => ({
        read: true,
        edit: true,
        create: true,
        delete: true
    }),
    properties: {
        name: {
            name: "Name",
            validation: { required: true },
            dataType: "string"
        },
        id: {
            name: "Identificador",
            validation: { required: true },
            dataType: "string"
        },
        price: {
            name: "Price",
            validation: {
                required: true,
                requiredMessage: "Você precisa colocar um preço entre 0 e 10000",
                min: 0,
                max: 1000
            },
            description: "Preço com range de validação",
            dataType: "number"
        },
        status: {
            name: "Status",
            validation: { required: true },
            dataType: "string",
            description: "Esse produto está avaliado para locação",
            enumValues: {
                private: "Sim",
                public: "Não"
            }
        },
        main_image: buildProperty({
            name: "Image",
            dataType: "string",
            storage: {
                storagePath: "images",
                acceptedFiles: ["image/*"]
            }
        }),
        description: {
            name: "Description",
            description: "Essa é a descrição do produto",
            multiline: true,
            longDescription: "Example of a long description hidden under a tooltip. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin quis bibendum turpis. Sed scelerisque ligula nec nisi pellentesque, eget viverra lorem facilisis. Praesent a lectus ac ipsum tincidunt posuere vitae non risus. In eu feugiat massa. Sed eu est non velit facilisis facilisis vitae eget ante. Nunc ut malesuada erat. Nullam sagittis bibendum porta. Maecenas vitae interdum sapien, ut aliquet risus. Donec aliquet, turpis finibus aliquet bibendum, tellus dui porttitor quam, quis pellentesque tellus libero non urna. Vestibulum maximus pharetra congue. Suspendisse aliquam congue quam, sed bibendum turpis. Aliquam eu enim ligula. Nam vel magna ut urna cursus sagittis. Suspendisse a nisi ac justo ornare tempor vel eu eros.",
            dataType: "string",
            columnWidth: 300
        },
        categories: {
            name: "Categories",
            validation: { required: true },
            dataType: "array",
            of: {
                dataType: "string",
                enumValues: tipoAparelho
            }
        },
        available_quantity: {
            name: "Quantidade Disponivel",
            dataType: "number",
        },
    }
});
