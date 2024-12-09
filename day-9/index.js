const { readArgvFile, arraySlices } = require("../utils");
const input = readArgvFile();
const inputNums = input
  .split("")
  .filter((c) => c !== "\n")
  .map((c) => parseInt(c));

let blocks = [];
let id = 0;
for (const [files, freeSpace] of arraySlices(inputNums, 2)) {
  blocks.push({
    id,
    files,
    freeSpace: freeSpace || 0,
  });
  id += 1;
}

const drawDiskMap = (blocks) => {
  console.dir(blocks);

  let str = "";
  for (const block of blocks) {
    str +=
      block.id.toString().repeat(block.files) + ".".repeat(block.freeSpace);
  }

  console.log(str);
};

const compact = (blocks) => {
  const firstBlockWithFreeSpaceIdx = blocks.findIndex(
    (block) => block.freeSpace > 0,
  );

  const firstBlockWithFreeSpace = blocks[firstBlockWithFreeSpaceIdx];

  if (firstBlockWithFreeSpace === undefined) {
    return blocks;
  }

  const lastBlock = blocks[blocks.length - 1];

  if (firstBlockWithFreeSpace.id === lastBlock.id) {
    console.log(`Moving ${lastBlock.id} to first block`);
    firstBlockWithFreeSpace.files += 1;
    firstBlockWithFreeSpace.freeSpace -= 1;
  } else {
    console.log(`Creating new block with id ${lastBlock.id}`);
    blocks.splice(firstBlockWithFreeSpaceIdx + 1, 0, {
      id: lastBlock.id,
      freeSpace: firstBlockWithFreeSpace.freeSpace - 1,
      files: 1,
    });
    firstBlockWithFreeSpace.freeSpace = 0;
  }

  lastBlock.files -= 1;

  if (lastBlock.files === 0) {
    blocks.pop();
  }

  // Do not add free space to the last block.
  // lastBlock.freeSpace += 1;

  // drawDiskMap(blocks);
  return compact(blocks);
};

const getChecksum = (blocks) => {
  let blockIdx = 0;
  let checksum = 0;
  for (const block of blocks) {
    // console.log(`${blockIdx} * ${block.id} = ${blockIdx * block.id}`);
    // console.log(`Checksum: ${checksum}`);
    for (let fileIdx = 0; fileIdx < block.files; fileIdx += 1) {
      checksum += blockIdx * block.id;
      blockIdx += 1;
    }
  }

  return checksum;
};

console.log(drawDiskMap(blocks));
compact(blocks);
console.log(drawDiskMap(blocks));
console.log(getChecksum(blocks));
