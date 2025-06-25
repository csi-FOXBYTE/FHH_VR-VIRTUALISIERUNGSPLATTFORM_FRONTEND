import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

(async () => {
  const { id } = await prisma.user.create({
    data: {
      email: "admin@foxbyte.de",
      name: "Admin Foxbyte",
    },
    select: {
      id: true,
    },
  });

  await prisma.visualAxis.createMany({
    data: [
      {
        endPointX: 0,
        endPointY: 0,
        endPointZ: 0,
        name: "Test",
        startPointX: 0,
        startPointY: 0,
        startPointZ: 0,
      }
    ]
  })

  await prisma.baseLayer.createMany({
    data: [
      {
        creatorId: id,
        href: "https://fhhvrshare.blob.core.windows.net/hamburg/3dtiles/area1/tileset.json",
        sizeGB: 2.78,
        type: "3D-TILES",
        name: "Area 1",
      },
      {
        creatorId: id,
        href: "https://fhhvrshare.blob.core.windows.net/hamburg/3dtiles/area2/tileset.json",
        sizeGB: 4.59,
        type: "3D-TILES",
        name: "Area 2",
      },
      {
        creatorId: id,
        href: "https://fhhvrshare.blob.core.windows.net/hamburg/3dtiles/area3/tileset.json",
        sizeGB: 1.99,
        type: "3D-TILES",
        name: "Area 3",
      },
      {
        creatorId: id,
        href: "https://fhhvrshare.blob.core.windows.net/hamburg/3dtiles/area4/tileset.json",
        sizeGB: 8.13,
        type: "3D-TILES",
        name: "Area 4",
      },
      {
        creatorId: id,
        href: "https://fhhvrshare.blob.core.windows.net/hamburg/3dtiles/area5/tileset.json",
        sizeGB: 2.45,
        type: "3D-TILES",
        name: "Area 5",
      },
      {
        creatorId: id,
        href: "https://fhhvrshare.blob.core.windows.net/hamburg/3dtiles/trees/tileset.json",
        sizeGB: 4.25,
        type: "3D-TILES",
        name: "Trees",
      },
      {
        creatorId: id,
        href: "https://fhhvrshare.blob.core.windows.net/hamburg/terrain",
        sizeGB: 3,
        type: "TERRAIN",
        name: "Terrain",
      },
      {
        creatorId: id,
        href: "https://fhhvrshare.blob.core.windows.net/hamburg/imagery/{z}/{x}/{y}.jpg",
        sizeGB: 13,
        type: "IMAGERY",
        name: "Imagery",
      },
    ],
  });
})();

// Put your custom seeding commands here!
