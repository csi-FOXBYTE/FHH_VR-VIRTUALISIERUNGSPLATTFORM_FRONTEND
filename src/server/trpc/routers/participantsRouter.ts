import { z } from "zod";
import { protectedProcedure, router } from "..";

const participantsRouter = router({

  searchParticipant: protectedProcedure([])
    .input(z.object({ name: z.string() }))
    .query(async (opts) => {
      const participants = await opts.ctx.db.user.findMany({
        take: 10,
        skip: 0,
        orderBy: {
          name: "asc",
        },
        select: {
          name: true,
          id: true,
        },
        where: {
          name: {
            contains: opts.input.name,
            mode: "insensitive",
          },
        },
      });

      return participants.map((participant) => ({
        label: participant.name,
        value: participant.id,
        option: participant.name
      }));
    }),
  // getParticipants: protectedProcedure([])
  //   .input(
  //     z.object({
  //       projectId: z.string(),
  //       participantId: z.string(),
  //     })
  //   )
  //   .query(async (opts) => {
  //     const { projectId, participantId } = opts.input;
  //     return opts.ctx.db.user .user.participants.(projectId, participantId);
  //   }),



  // deleteParticipant: protectedProcedure([])
  //   .input(
  //     z.object({
  //       projectId: z.string(),
  //       participantId: z.string(),
  //     })
  //   )
  //   .mutation(async (opts) => {
  //     const { projectId, participantId } = opts.input;
  //     await opts.ctx.services.project.deleteParticipant(projectId, participantId);
  //     return { success: true };
  //   }),

  // addParticipants: protectedProcedure([])
  //   .input(
  //     z.object({
  //       projectId: z.string(),
  //       participants: z.array(
  //         z.object({
  //           name: z.string(),
  //           email: z.string(),
  //           role: z.enum(['admin', 'user']),
  //         })
  //       ),
  //     })
  //   )
  //   .mutation(async (opts) => {
  //     const { projectId, participants } = opts.input;
  //     const addedParticipants = await Promise.all(
  //       await opts.ctx.services.project.addParticipants(projectId, participants)
  //     );
  //     return addedParticipants;
  //   }),

});

export default participantsRouter;