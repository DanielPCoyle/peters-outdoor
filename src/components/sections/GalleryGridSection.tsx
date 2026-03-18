import Image from "next/image";

interface GalleryImage {
  src: string;
  alt: string;
  span?: string;
}

interface GalleryGridSectionProps {
  images?: GalleryImage[];
}

const defaultImages: GalleryImage[] = [
  {
    src: "https://static.wixstatic.com/media/5768ba_228ce943b71e4538a11a9ab52ddaf6ad~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85,enc_avif,quality_auto/5768ba_228ce943b71e4538a11a9ab52ddaf6ad~mv2.jpg",
    alt: "Sunset over the Maryland marsh",
    span: "col-span-2 row-span-2",
  },
  {
    src: "https://static.wixstatic.com/media/5768ba_3bc8f28567d84fdbba85e29534c0e859~mv2.jpg/v1/fill/w_600,h_600,al_c,q_85,enc_avif,quality_auto/5768ba_3bc8f28567d84fdbba85e29534c0e859~mv2.jpg",
    alt: "Pocomoke River kayaking through cypress trees",
    span: "",
  },
  {
    src: "https://static.wixstatic.com/media/5768ba_8efacc66b0074908b6c5c8b6a8abd3c7~mv2.jpg/v1/fill/w_600,h_600,al_c,q_85,enc_avif,quality_auto/PXL_20251106_215242625_edited.jpg",
    alt: "St. Martin River sunset",
    span: "",
  },
  {
    src: "https://static.wixstatic.com/media/5768ba_359609431599441684b622533bee766f~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85,enc_avif,quality_auto/PXL_20250509_151508817_MP.jpg",
    alt: "Wild ponies at Assateague Island",
    span: "col-span-2",
  },
  {
    src: "https://static.wixstatic.com/media/5768ba_a2d76f158bc74f90b6db4b28452ab0e1~mv2.jpg/v1/fill/w_600,h_600,al_c,q_85,enc_avif,quality_auto/20221012_121045.jpg",
    alt: "Coastal forest at Newport Bay",
    span: "",
  },
  {
    src: "https://static.wixstatic.com/media/5768ba_388163a383e849019d7b74abfa4e0da0~mv2.jpg/v1/fill/w_600,h_600,al_c,q_85,enc_avif,quality_auto/PXL_20250823_233340318_MP.jpg",
    alt: "Sunset kayak tour",
    span: "",
  },
  {
    src: "https://static.wixstatic.com/media/5768ba_b2953e61daad4dd08109df65193010b6~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85,enc_avif,quality_auto/PXL_20251007_225010061.jpg",
    alt: "Full moon over the water",
    span: "col-span-2",
  },
  {
    src: "https://static.wixstatic.com/media/5768ba_b0bd60522dbe4c95821c13551a01b85b~mv2.jpg/v1/crop/x_145,y_106,w_2291,h_1555/fill/w_600,h_400,al_c,q_85,enc_avif,quality_auto/PXL_20250811_124020150_edited.jpg",
    alt: "Guide on the water",
    span: "",
  },
];

export default function GalleryGridSection({ images = defaultImages }: GalleryGridSectionProps) {
  return (
    <section className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[300px]">
          {images.map((img, i) => (
            <div
              key={i}
              className={`relative rounded-2xl overflow-hidden group cursor-pointer ${img.span ?? ""}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white text-sm font-medium">{img.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
