
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Button } from '../components/ui/button';

const BlockSelector: React.FC = () => {
  const { blocks, selectedBlock, setSelectedBlock } = useAppContext();
  
  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium mb-2">Blok Seçin</h2>
      <div className="flex flex-wrap gap-2">
        {blocks.map((block) => (
          <Button
            key={block.id}
            variant={selectedBlock === block.id ? "default" : "outline"}
            className="flex-grow sm:flex-grow-0"
            onClick={() => setSelectedBlock(block.id)}
          >
            {block.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default BlockSelector;
