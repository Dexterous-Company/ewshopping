import { FaAngleRight } from "react-icons/fa";

const GridwithBanner = () => {
  const items = [
    {
      img: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?ixlib=rb-1.2.1&auto=format&fit=crop&w=180&h=180&q=60",
      title: "Windproof Umbrellas",
      offer: "Min. 60% Off",
      width: 180,
      height: 180,
    },
    {
      img: "/assets/images/rainc.jpg",
      title: "Raincoats & Ponchos",
      offer: "From ₹299",
      width: 180,
      height: 180,
    },
    {
      img: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?ixlib=rb-1.2.1&auto=format&fit=crop&w=180&h=180&q=60",
      title: "Waterproof Shoes",
      offer: "Min. 50% Off",
      width: 180,
      height: 180,
    },
    {
      img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=180&h=180&q=60",
      title: "Waterproof Backpacks",
      offer: "Min. 55% Off",
      width: 180,
      height: 180,
    },
  ];

  return (
    <section className="p-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 shadow rounded col-span-1">
          <div className="flex items-center justify-between mb-4">
            <span className="font-bold text-lg">Monsoon Essentials</span>
            <FaAngleRight className="text-white bg-[#21f5d] p-1 rounded-full" size={20} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {items.map((item, index) => (
              <div key={index} className="shadow rounded p-2 text-center h-full">
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className="w-full mb-2 rounded" 
                  width={item.width}
                  height={item.height}
                  loading="lazy"
                />
                <div className="font-semibold truncate text-left" title={item.title}>
                  {item.title}
                </div>
                <div className="text-green-600 text-sm font-bold text-left">
                  {item.offer}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden sm:block col-span-2">
          <img
            src="assets/images/bann.png"
            alt="Banner"
            className="w-full h-full object-contain rounded shadow"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default GridwithBanner;