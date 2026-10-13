export interface PayuVerifiedProduct {
  id: string;
  title: string;
  price: number;
  mrp?: number;
  retailer: string;
  shopUrl: string;
  sourceLabel: string;
  availability: 'in-stock';
}

export const PAYU_VERIFIED_PRODUCTS: PayuVerifiedProduct[] = [
  {
    id: 'bathani-white-lehenga',
    title: 'BATHANI TEXTILE Embroidered Semi Stitched Lehenga and Crop Top',
    price: 1165,
    mrp: 2999,
    retailer: 'Flipkart',
    shopUrl: 'https://www.wishlink.com/share/nt2scn',
    sourceLabel: 'Exact VIRAAS workbook link',
    availability: 'in-stock',
  },
  {
    id: 'samyati-designer-lehenga',
    title: 'Designer Lehenga Choli',
    price: 2999,
    mrp: 3499,
    retailer: 'Samyati Saree',
    shopUrl: 'https://samyatisaree.com/product/designer-lehenga-choli-2/',
    sourceLabel: 'Exact VIRAAS workbook link',
    availability: 'in-stock',
  },
  {
    id: 'villagers-trend-navratri-lehenga',
    title: 'Designer Lehenga Navratri Chaniya Choli',
    price: 2625,
    mrp: 3360,
    retailer: 'Villagers Trend',
    shopUrl: 'https://villagerstrend.com/product/designer-lehenga-navratri-chanya-choli-collaction',
    sourceLabel: 'Exact VIRAAS workbook link',
    availability: 'in-stock',
  },
  {
    id: 'beauty-queen-black-lehenga',
    title: 'Black Georgette Navratri Lehenga Choli with Kutchi Embroidery and Mirror Work',
    price: 3499,
    mrp: 8599,
    retailer: 'The Beauty Queen',
    shopUrl: 'https://thebeautyqueen.in/products/black-georgette-navratri-kutchi-embroidery-mirror-work-lehenga',
    sourceLabel: 'Exact VIRAAS workbook link',
    availability: 'in-stock',
  },
  {
    id: 'shubh-viyan-bandhani-lehenga',
    title: 'Shubh-Viyan Textiles Bandhani Leheriya Digital Print Semi Stitched Lehenga Choli',
    price: 895,
    mrp: 1499,
    retailer: 'Flipkart',
    shopUrl: 'https://www.wishlink.com/share/62k546',
    sourceLabel: 'Exact VIRAAS workbook link',
    availability: 'in-stock',
  },
  {
    id: 'kalini-sequinned-lehenga',
    title: 'KALINI Printed Sequinned Ready to Wear Lehenga and Blouse with Dupatta',
    price: 1524,
    retailer: 'Myntra',
    shopUrl: 'https://www.wishlink.com/share/6mbasf',
    sourceLabel: 'Exact VIRAAS workbook link',
    availability: 'in-stock',
  },
];
