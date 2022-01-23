import {SubstrateEvent} from "@subql/types";
import {StakingReward, SumReward} from "../types";
import {Balance} from "@polkadot/types/interfaces";


export async function handleStakingRewarded(event: SubstrateEvent): Promise<void> {
    const {event: {data: [account, newReward]}} = event;
    //Create the stakingReward entity
    const entity = new StakingReward(`${event.block.block.header.number}-${event.idx.toString()}`);
    //Set all properties to entity
    entity.accountId = account.toString();
    entity.balance = (newReward as Balance).toBigInt();
    entity.date = event.block.timestamp;
    await entity.save();
}

function createSumReward(accountId: string): SumReward {
    const entity = new SumReward(accountId);
    entity.totalReward = BigInt(0);
    return entity;
}
export async function handleSumRewarded(event: SubstrateEvent): Promise<void> {
    const {event: {data: [account, newReward]}} = event;
    //Retrieve SumReward entity if not exist then create new one
    let entity = await SumReward.get(account.toString());
    if (entity === undefined){
        entity = createSumReward(account.toString());
    }
    //Get sum reward prev+current
    entity.totalReward = entity.totalReward + (newReward as Balance).toBigInt();
    entity.blockheight = event.block.block.header.number.toNumber();
    await entity.save();
}

export async function handleSumReward(event: SubstrateEvent): Promise<void> {
    await handleSumRewarded(event)
}
export async function handleStakingReward(event: SubstrateEvent): Promise<void> {
    await handleStakingRewarded(event)
}



