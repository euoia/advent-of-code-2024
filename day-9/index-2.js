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
  let str = "";
  for (const block of blocks) {
    str +=
      block.id.toString().repeat(block.files) + ".".repeat(block.freeSpace);
  }

  console.log(str);
};

const compact = (blocks, candidateBlockStartIdx) => {
  // drawDiskMap(blocks);

  for (
    let candidateBlockIdx = candidateBlockStartIdx;
    candidateBlockIdx > 0;
    candidateBlockIdx -= 1
  ) {
    const candidateBlock = blocks[candidateBlockIdx];
    // console.log(
    //   `Finding space for candidate block ${candidateBlock.id}, files=${candidateBlock.files}`,
    // );

    for (
      let candidateSpaceIdx = 0;
      candidateSpaceIdx < candidateBlockIdx;
      candidateSpaceIdx += 1
    ) {
      const candidateSpace = blocks[candidateSpaceIdx];

      if (candidateBlock.files <= candidateSpace.freeSpace) {
        // console.log(
        //   `Found a space at idx=${candidateSpaceIdx} for candidate block ${candidateBlock.id}`,
        // );

        if (candidateBlock.id > 1) {
          const previousBlock = blocks[candidateBlockIdx - 1];
          previousBlock.freeSpace += candidateBlock.files + candidateBlock.freeSpace;
        }

        candidateBlock.freeSpace =
          candidateSpace.freeSpace - candidateBlock.files;
        candidateSpace.freeSpace = 0;

        blocks.splice(candidateSpaceIdx + 1, 0, candidateBlock);
        blocks.splice(candidateBlockIdx + 1, 1);

        return compact(blocks, candidateBlockIdx);
      }
    }

    // console.log(
    //   `Failed to find space for candidate block ${candidateBlock.id}`,
    // );
  }

  return blocks;
};

const getChecksum = (blocks) => {
  let blockIdx = 0;
  let checksum = 0;
  for (const block of blocks) {
    for (let fileIdx = 0; fileIdx < block.files; fileIdx += 1) {
      checksum += blockIdx * block.id;
      blockIdx += 1;

      // console.log(`${blockIdx} * ${block.id} = ${blockIdx * block.id}`);
      // console.log(`Checksum: ${checksum}`);
    }

    for (
      let freeSpaceIdx = 0;
      freeSpaceIdx < block.freeSpace;
      freeSpaceIdx += 1
    ) {
      blockIdx += 1;
    }
  }

  return checksum;
};

const compactedBlocks = compact(blocks, blocks.length - 1);
console.log(getChecksum(compactedBlocks));
