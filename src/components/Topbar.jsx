import React from "react";
import { useDispatch } from "react-redux";
import { toggleSidebar } from "../store/uiSlice";

const Topbar = () => {
  const dispatch = useDispatch();

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm"
            onClick={() => dispatch(toggleSidebar())}
          >
            Menu
          </button>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Backend
            </p>
            <p className="text-sm font-semibold text-slate-700">
              http://deployment-ags-1-816947313.ap-south-1.elb.amazonaws.com/
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
          <span className="rounded-full bg-slate-100 px-3 py-1 font-medium">
            No auth required
          </span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
