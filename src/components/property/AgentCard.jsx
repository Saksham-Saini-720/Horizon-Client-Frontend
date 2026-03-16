
import { memo } from "react";

const AgentCard = memo(({ agent }) => {
  return (
    <div className="px-5 pt-4 pb-5 border-t shadow-xl mx-4 mt-3 rounded-lg border-gray-100">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
          {agent.avatar ? (
            <img 
              src={agent.avatar} 
              alt={agent.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-secondary to-secondary flex items-center justify-center">
              <span className="text-white text-[20px] font-semibold font-inter">
                {agent.name[0]}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <p className="text-[16px] font-semibold text-primary font-inter mb-0.5">
            {agent.name}
          </p>
          <p className="text-[12px] text-gray-500 font-inter">
            {agent.title}
          </p>
        </div>
      </div>
    </div>
  );
});

export default AgentCard;


