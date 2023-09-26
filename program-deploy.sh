#!/usr/bin/env bash

cargo build-bpf

solana program deploy ./target/deploy/solana_program_evidence_storage.so