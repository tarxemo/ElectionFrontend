export const StarRatingDisplay = ({ score, outOf = 5 }) => {
    const stars = [];
  
    for (let i = 1; i <= outOf; i++) {
      stars.push(
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-yellow-500"
          fill={i <= score ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499l2.388 4.835 5.332.775-3.86 3.76.911 5.312-4.771-2.507-4.772 2.507.911-5.312-3.86-3.76 5.332-.775 2.388-4.835z"
          />
        </svg>
      );
    }
  
    return <div className="flex mt-1">{stars}</div>;
  };

