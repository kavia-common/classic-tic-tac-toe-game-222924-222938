#!/bin/bash
cd /home/kavia/workspace/code-generation/classic-tic-tac-toe-game-222924-222938/frontend_react
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

