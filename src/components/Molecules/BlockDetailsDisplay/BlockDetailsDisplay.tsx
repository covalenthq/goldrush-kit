import { useEffect, useState } from 'react';
import { type BlockDetailsDisplayProps } from '@/utils/types/molecules.types';
import { useCovalent } from '@/utils/store/Covalent';
import { useToast } from '../../../utils/hooks/use-toast';
import { type Transaction } from '@covalenthq/client-sdk';
import { type Option, Some, None } from '@/utils/option';
import { IconWrapper } from '../../Atoms/IconWrapper/IconWrapper';
import { GRK_SIZES } from '@/utils/constants/shared.constants';
import { TokenAvatar } from '@/components/Atoms/TokenAvatar/TokenAvatar';
import { Skeleton } from '@/components/ui/skeleton';

const BlockDetailsDisplay: React.FC<BlockDetailsDisplayProps> = ({
  chain_name,
  block_id,
  icon_url,
}) => {
  const [maybeResult, setResult] = useState<Option<Transaction[]>>(None);
  const { covalentClient } = useCovalent();
  const [showCopy, setShowCopy] = useState(false);
  const [showCopyMiner, setShowCopyMiner] = useState(false);
  const { toast } = useToast();

  const handleCopyClick = (value: string, setShowCopyState: React.Dispatch<React.SetStateAction<boolean>>) => {
    toast({
      description: `${value} copied!`,
    });
    setShowCopyState(true);
    setTimeout(() => {
      setShowCopyState(false);
    }, 3000);
  };

  const fetchBlockData = async () => {
    setResult(None);
    try {
      const response = await covalentClient.TransactionService.getTransactionsForBlock(
        chain_name,
        block_id,
        { quoteCurrency: 'USD', noLogs: true, withSafe: false }
      );
        console.log (response)
      if (response.data && response.data.items) {
        setResult(new Some(response.data.items));
      } else {
        console.error(`Error fetching block data for ${chain_name}: Response data or items is null or undefined.`);
      }
    } catch (error) {
      console.error(`Error fetching block data for ${chain_name}:`, error);
    }
  };
  

  useEffect(() => {
    fetchBlockData();
  }, [chain_name, block_id]);

  return (
    <>
      <div className="flex w-full items-center gap-x-4 rounded border p-2 md:max-w-[18rem] lg:max-w-[18rem]">
        <TokenAvatar is_chain_logo={false} token_url={icon_url} size={GRK_SIZES.MEDIUM} />
        <div className="flex h-full flex-col justify-center">
        <h2 className="text-base font-semibold text-muted-foreground">{chain_name.toString()}</h2>
          <h2 className="text-base font-semibold text-muted-foreground">{block_id.toString()}</h2>
          <div className="flex h-full flex-col justify-center">
            {maybeResult.match({
              None: () => <Skeleton size={GRK_SIZES.MEDIUM} />,
              Some: (data) => {
                if (data[0]) {
                  return (
                    <>
                      <BlockDetailItem iconClass="tag" label="Block Hash" value={data[0].block_hash.slice(0,7)+"..."+data[0].block_hash.slice(-4)} onCopy={() => handleCopyClick('Block Hash', setShowCopy)} showCopy={showCopy} />
                      <BlockDetailItem iconClass="calendar_month" label="Timestamp" value={data[0].block_signed_at.toISOString().slice(0, 10)} />
                      <BlockDetailItem iconClass="accessibility" label="Miner Address" value={data[0].miner_address} onCopy={() => handleCopyClick('Miner Address', setShowCopyMiner)} showCopy={showCopyMiner} />
                      <BlockDetailItem iconClass="123" label="Transaction Count" value={data.length.toString()} />
                    </>
                  );
                } else {
                  return <>No Data</>;
                }
              },
            })}
          </div>
        </div>
      </div>
    </>
  );
};

type BlockDetailItemProps = {
  iconClass: string;
  label: string;
  value: string;
  onCopy?: () => void;
  showCopy?: boolean; // optional
};

const BlockDetailItem: React.FC<BlockDetailItemProps> = ({ iconClass, label, value, onCopy, showCopy }) => (
  <div className="flex items-center gap-x-2">
     <IconWrapper icon_class_name={iconClass} icon_size="text-sm" class_name="text-secondary dark:text-secondary" />
    {label === 'Miner Address' ? value.substring(0, 10) : value}
    {onCopy && (
      <div className="duration-400 h-5 w-5 cursor-pointer items-center justify-center rounded-full transition-all" onClick={onCopy}>
        {showCopy ? (
          <IconWrapper icon_class_name="done" icon_size="text-sm" class_name="text-secondary dark:text-secondary" />
        ) : (
          <IconWrapper icon_class_name="content_copy" icon_size="text-sm" class_name="text-secondary dark:text-secondary" on_click={onCopy} />
        )}
      </div>
    )}
  </div>
);

export default BlockDetailsDisplay;
