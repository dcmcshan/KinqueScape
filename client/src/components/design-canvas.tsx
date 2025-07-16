import { useState, useRef, useEffect } from "react";
import { ZoomIn, ZoomOut, Undo, Redo, Grid, Magnet } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CanvasElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DesignCanvasProps {
  selectedTool: string | null;
  onElementAdd: (element: CanvasElement) => void;
  elements: CanvasElement[];
}

export default function DesignCanvas({ selectedTool, onElementAdd, elements }: DesignCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!selectedTool || isDragging) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newElement: CanvasElement = {
      id: `${selectedTool}-${Date.now()}`,
      type: selectedTool,
      x: snapToGrid ? Math.round(x / 20) * 20 : x,
      y: snapToGrid ? Math.round(y / 20) * 20 : y,
      width: 60,
      height: 60,
    };

    onElementAdd(newElement);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getElementIcon = (type: string) => {
    const iconMap: Record<string, string> = {
      wall: "⬜",
      door: "🚪",
      window: "🪟",
      furniture: "🪑",
      puzzle: "🧩",
      clue: "🔍",
      lock: "🔒",
      trigger: "👆",
    };
    return iconMap[type] || "📦";
  };

  return (
    <div className="relative">
      <div 
        ref={canvasRef}
        className={`bg-gray-100 rounded-lg min-h-96 relative border-2 border-dashed border-gray-300 overflow-hidden ${
          selectedTool ? 'cursor-crosshair' : 'cursor-default'
        }`}
        style={{ 
          backgroundImage: showGrid ? 'radial-gradient(circle, #ccc 1px, transparent 1px)' : 'none',
          backgroundSize: showGrid ? '20px 20px' : 'auto',
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'top left',
        }}
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {elements.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl text-gray-400 mb-4">🏗️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Start Designing Your Room</h3>
              <p className="text-gray-600 mb-4">Select a tool from the left panel and click on the canvas to add elements</p>
              <Button>
                <span className="mr-2">➕</span>Add Room Template
              </Button>
            </div>
          </div>
        ) : (
          elements.map((element) => (
            <div
              key={element.id}
              className="absolute bg-white border-2 border-gray-400 rounded flex items-center justify-center text-2xl cursor-move hover:border-primary transition-colors"
              style={{
                left: element.x,
                top: element.y,
                width: element.width,
                height: element.height,
              }}
              title={element.type}
            >
              {getElementIcon(element.type)}
            </div>
          ))
        )}
      </div>
      
      {/* Canvas Controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" title="Undo">
            <Undo className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" title="Redo">
            <Redo className="w-4 h-4" />
          </Button>
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          <Button 
            variant="outline" 
            size="sm" 
            title="Zoom In"
            onClick={() => setZoom(Math.min(200, zoom + 25))}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            title="Zoom Out"
            onClick={() => setZoom(Math.max(50, zoom - 25))}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-600">{zoom}%</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Grid:</span>
          <Button 
            variant={showGrid ? "default" : "outline"} 
            size="sm" 
            title="Show Grid"
            onClick={() => setShowGrid(!showGrid)}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button 
            variant={snapToGrid ? "default" : "outline"} 
            size="sm" 
            title="Snap to Grid"
            onClick={() => setSnapToGrid(!snapToGrid)}
          >
            <Magnet className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
