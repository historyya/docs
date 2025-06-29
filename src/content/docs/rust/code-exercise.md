---
title: Code Exercise
description: Code Exercise
sidebar:
  order: 9
---

## 简单计算器

```rust
use std::io;
use std::io::Write;

fn main() {
    let mut typer = UserTyper::new(CommandLineComputer);

    loop {
        typer.type_expr();
        println!("Result: {}", typer.compute());
    }
}

trait Computer {
    fn compute(&self, expr: &str) -> i32;
}

struct CommandLineComputer;

impl Computer for CommandLineComputer {
    fn compute(&self, expr: &str) -> i32 {
        let mut num1 = String::new();
        let mut num2 = String::new();
        let mut op: Option<char> = None;
        for chr in expr.trim().chars() {
            if chr.is_digit(10) {
                if op.is_none() {
                    num1.push(chr);
                } else {
                    num2.push(chr);
                }

                continue;
            }

            // fix: 2 ++ 3
            match chr {
                '+' | '-' | '*' | '/' if op.is_none() => op = Some(chr),
                _ if chr.is_whitespace() => continue,
                _ => panic!("Invalid character: {}", chr),
            }
        }

        if num1.is_empty() || num2.is_empty() || op.is_none() {
            panic!("Invalid expression: {}", expr);
        }

        let num1 = num1.parse::<i32>().unwrap();
        let num2 = num2.parse::<i32>().unwrap();
        let op = op.unwrap();
        match op {
            '+' => num1 + num2,
            '-' => num1 - num2,
            '*' => num1 * num2,
            '/' => num1 / num2,
            _ => unreachable!(),
        }
    }
}

struct UserTyper<T: Computer> {
    computer: T,
    expr: String,
}

impl<T: Computer> UserTyper<T> {
    fn new(computer: T) -> Self {
        Self {
            computer,
            expr: String::new(),
        }
    }

    fn type_expr(&mut self) {
        self.expr.clear();
        print!("Please type an expression: ");
        io::stdout().flush().expect("Failed to flush stdout");
        io::stdin()
            .read_line(&mut self.expr)
            .expect("Failed to read line");
    }

    fn compute(&mut self) -> i32 {
        self.computer.compute(&self.expr)
    }
}
```
